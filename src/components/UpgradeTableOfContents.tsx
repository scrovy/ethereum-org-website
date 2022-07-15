import React from "react"
import { motion } from "framer-motion"
import { Link } from "gatsby"
import styled from "styled-components"

const customIdRegEx = /^.+(\s*\{#([A-Za-z0-9\-_]+?)\}\s*)$/

interface Item {
  id: string
  title: string
}

export interface IProps {
  items: Array<Item>
  maxDepth: number | null
  className?: string
}

const Aside = styled.aside`
  padding: 0rem;
  text-align: right;
  margin-bottom: 2rem;
  overflow-y: auto;
`

const OuterList = styled(motion.ul)`
  list-style-type: none;
  list-style-image: none;
  padding: 0;
  margin: 0;
  font-size: 1.25rem;
  text-align: right;
  line-height: 1.6;
  font-weight: 400;
  padding-right: 0.25rem;
  padding-left: 1rem;

  @media (max-width: ${(props) => props.theme.breakpoints.l}) {
    display: none;
  }
`

const ListItem = styled.li`
  margin: 0;
`

const StyledTableOfContentsLink = styled(Link)`
  position: relative;
  display: inline-block;
  color: ${(props) => props.theme.colors.text300};
  margin-bottom: 0.5rem !important;
`

const slugify = (s: string): string =>
  encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-"))

const getCustomId = (title: string): string => {
  const match = customIdRegEx.exec(title)
  if (match) {
    return match[2].toLowerCase()
  }
  console.warn("Missing custom ID on header: ", title)
  return slugify(title)
}

const trimmedTitle = (title: string): string => {
  const match = customIdRegEx.exec(title)
  return match ? title.replace(match[1], "").trim() : title
}

const TableOfContentsLink = ({
  depth,
  item,
}: {
  depth: number
  item: Item
}) => {
  const url = `#${getCustomId(item.title)}`
  let isActive = false
  if (typeof window !== `undefined`) {
    isActive = window.location.hash === url
  }
  const isNested: boolean = depth === 2
  let classes: string = ""
  if (isActive) {
    classes += " active"
  }
  if (isNested) {
    classes += " nested"
  }
  return (
    <StyledTableOfContentsLink to={url} className={classes}>
      {trimmedTitle(item.title)}
    </StyledTableOfContentsLink>
  )
}

const ItemsList = ({
  items,
  depth,
  maxDepth,
}: {
  items: Item[]
  depth: number
  maxDepth: number
}) =>
  depth <= maxDepth && !!items ? (
    <React.Fragment>
      {items.map((item, index) => (
        <ListItem key={index}>
          <div>
            <TableOfContentsLink depth={depth} item={item} />
          </div>
        </ListItem>
      ))}
    </React.Fragment>
  ) : (
    <></>
  )

const UpgradeTableOfContents: React.FC<IProps> = ({
  items,
  maxDepth,
  className,
}) => {
  if (!items) {
    return null
  }
  // Exclude <h1> from TOC
  if (items.length === 1) {
    items = [items[0]]
  }

  return (
    <Aside className={className}>
      <OuterList>
        <ItemsList items={items} depth={0} maxDepth={maxDepth ? maxDepth : 1} />
      </OuterList>
    </Aside>
  )
}

export default UpgradeTableOfContents
